import path from 'node:path'
import { and, eq } from 'drizzle-orm'
import pdfMake from 'pdfmake'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { openConnection } from '#server/db'
import { events } from '#server/db/schema'

const RADIX = 10
const DESC_MAX_LENGTH = 35
const LOCALE_GB = 'en-GB'

const PRIMARY_COLOR = '#3f51b5'
const BORDER_COLOR = '#c8c8c8'
const COLOR_WHITE = 'white'
const COLOR_BLACK = 'black'
const HEADER_FONT_SIZE = 18
const TABLE_FONT_SIZE = 10
const DEFAULT_FONT = 'Helvetica'
const PAGE_ORIENTATION = 'landscape'

const PAGE_MARGIN_X = 40
const PAGE_MARGIN_Y = 20

const TABLE_MARGIN_X = 40
const TABLE_MARGIN_Y = 0

const HEADER_PADDING_X = 0
const HEADER_PADDING_Y = 5
const ROW_PADDING_X = 0
const ROW_PADDING_Y = 2

const COLUMN_WIDTH_ID = '10%'
const COLUMN_WIDTH_NAME = '25%'
const COLUMN_WIDTH_TYPE = '15%'
const COLUMN_WIDTH_DESC = '30%'
const COLUMN_WIDTH_DATE = '20%'

const LINE_WIDTH_THIN = 0.5
const LINE_WIDTH_NONE = 0

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const month = Number.parseInt(query.month as string, RADIX)
  const year = Number.parseInt(query.year as string, RADIX)

  if (Number.isNaN(month) || Number.isNaN(year)) {
    throw createError({
      statusCode: StatusCodes.BAD_REQUEST,
      statusMessage: 'Invalid month or year',
    })
  }

  try {
    const db = openConnection()

    const eventsData = await db
      .select({
        id: events.id,
        name: events.name,
        type: events.type,
        description: events.description,
        date: events.date,
      })
      .from(events)
      .where(and(eq(events.month, month), eq(events.year, year)))

    const fonts = {
      [DEFAULT_FONT]: {
        normal: path.resolve(process.cwd(), 'public/fonts/Helvetica.ttf'),
        bold: path.resolve(process.cwd(), 'public/fonts/Helvetica-Bold.ttf'),
      },
    }

    pdfMake.addFonts(fonts)

    const currentDate = new Date().toLocaleString(LOCALE_GB, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const docDefinition: TDocumentDefinitions = {
      pageOrientation: PAGE_ORIENTATION,
      content: [
        {
          columns: [
            { text: 'Events Report', style: 'header' },
            { text: currentDate, alignment: 'right', style: 'header' },
          ],
          margin: [PAGE_MARGIN_X, PAGE_MARGIN_Y, PAGE_MARGIN_X, PAGE_MARGIN_Y],
        },
        {
          table: {
            headerRows: 1,
            widths: [
              COLUMN_WIDTH_ID,
              COLUMN_WIDTH_NAME,
              COLUMN_WIDTH_TYPE,
              COLUMN_WIDTH_DESC,
              COLUMN_WIDTH_DATE,
            ],
            body: [
              [
                { text: 'ID', style: 'tableHeader' },
                { text: 'Event Name', style: 'tableHeader' },
                { text: 'Type', style: 'tableHeader' },
                { text: 'Description', style: 'tableHeader' },
                { text: 'Date', style: 'tableHeader' },
              ],
              ...eventsData.map((event) => [
                event.id.toString(),
                event.name,
                event.type,
                (event.description?.length ?? 0) > DESC_MAX_LENGTH
                  ? `${event.description?.substring(0, DESC_MAX_LENGTH)}...`
                  : event.description || 'N/A',
                event.date
                  ? new Date(event.date).toLocaleDateString(LOCALE_GB)
                  : 'Brak daty',
              ]),
            ],
          },
          layout: {
            hLineWidth: (i: number) =>
              i === 0 ? LINE_WIDTH_NONE : LINE_WIDTH_THIN,
            vLineWidth: () => LINE_WIDTH_NONE,
            hLineColor: (i: number) => (i === 1 ? BORDER_COLOR : COLOR_WHITE),
            fillColor: (rowIndex: number) =>
              rowIndex === 0 ? PRIMARY_COLOR : null,
          },
          margin: [
            TABLE_MARGIN_X,
            TABLE_MARGIN_Y,
            TABLE_MARGIN_X,
            TABLE_MARGIN_Y,
          ],
        },
      ],
      styles: {
        header: {
          fontSize: HEADER_FONT_SIZE,
          bold: true,
          color: PRIMARY_COLOR,
        },
        tableHeader: {
          bold: true,
          fontSize: TABLE_FONT_SIZE,
          color: COLOR_WHITE,
          margin: [
            HEADER_PADDING_X,
            HEADER_PADDING_Y,
            HEADER_PADDING_X,
            HEADER_PADDING_Y,
          ],
        },
      },
      defaultStyle: {
        font: DEFAULT_FONT,
        fontSize: TABLE_FONT_SIZE,
        color: COLOR_BLACK,
        margin: [ROW_PADDING_X, ROW_PADDING_Y, ROW_PADDING_X, ROW_PADDING_Y],
      },
    }

    const pdf = pdfMake
      .createPdf(docDefinition)
      .getBuffer()
      .catch((err) => console.error(err))

    setResponseHeaders(event, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="events-report-${month}-${year}.pdf"`,
    })

    return pdf
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw createError({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      statusMessage: 'Failed to generate PDF report',
    })
  }
})
